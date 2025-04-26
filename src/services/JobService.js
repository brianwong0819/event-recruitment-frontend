import axios from 'axios';
import fileService from './file.service';

class JobService {
  // Base API URL
  static API_URL = 'http://localhost:8080/api';

  // Get jobs with filters, pagination
  static async getJobs(filters = {}, page = 0, perPage = 10) {
    try {
      // Store keyword search for client-side filtering
      const keywordSearch = filters.keywords
        ? filters.keywords.toLowerCase()
        : '';

      // Build query parameters - excluding keywords that we'll filter on the client side
      let params = {
        page,
        size: perPage,
      };

      // Add filters if provided
      if (filters.jobTitle?.value) {
        params.jobTitleType = filters.jobTitle.value;
      }

      if (filters.minSalary) {
        params.minSalary = filters.minSalary;
      }

      if (filters.maxSalary) {
        params.maxSalary = filters.maxSalary;
      }

      if (filters.location) {
        params.location = filters.location;
      }

      if (filters.startDate) {
        params.startDate = this.formatDate(filters.startDate);
      }

      if (filters.endDate) {
        params.endDate = this.formatDate(filters.endDate);
      }

      if (filters.datePosted?.value) {
        const today = new Date();
        let startDateFilter = new Date();

        switch (filters.datePosted.value) {
          case 'today':
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'yesterday':
            startDateFilter.setDate(today.getDate() - 1);
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'last3Days':
            startDateFilter.setDate(today.getDate() - 3);
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'lastWeek':
            startDateFilter.setDate(today.getDate() - 7);
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'lastMonth':
            startDateFilter.setMonth(today.getMonth() - 1);
            params.startDate = this.formatDate(startDateFilter);
            break;
        }
      }

      let apiJobs = [];
      if (filters.distance && filters.distance > 0) {
        const token = this.getAuthToken();

        if (!token) {
          console.warn(
            'No authentication token found for near-me API, falling back to public API'
          );
          // If no token is available, fall back to the public API
          const response = await axios.get(`${this.API_URL}/jobs/public`, {
            params,
          });

          if (
            response.data &&
            response.data.statusCode === 200 &&
            response.data.data
          ) {
            apiJobs = response.data.data.content || [];
          }
        } else {
          const headers = { Authorization: token };

          try {
            const response = await axios.get(
              `${this.API_URL}/jobs/candidate/near-me`,
              {
                params: { ...params, distance: filters.distance },
                headers,
              }
            );

            if (
              response.data &&
              response.data.statusCode === 200 &&
              response.data.data
            ) {
              apiJobs = response.data.data.content || [];
            }
          } catch (error) {
            console.error(
              'Error with near-me API, falling back to public API:',
              error
            );
            // Fall back to public API if near-me fails
            const response = await axios.get(`${this.API_URL}/jobs/public`, {
              params,
            });

            if (
              response.data &&
              response.data.statusCode === 200 &&
              response.data.data
            ) {
              apiJobs = response.data.data.content || [];
            }
          }
        }
      } else {
        // Make the API call to the standard endpoint
        const response = await axios.get(`${this.API_URL}/jobs/public`, {
          params,
        });

        if (
          response.data &&
          response.data.statusCode === 200 &&
          response.data.data
        ) {
          apiJobs = response.data.data.content || [];
        }
      }

      // Filter jobs by keyword search on client side if needed
      let filteredJobs = apiJobs;
      if (keywordSearch) {
        filteredJobs = apiJobs.filter((job) => {
          const titleMatch = job.title?.toLowerCase().includes(keywordSearch);
          const companyMatch = job.companyName
            ?.toLowerCase()
            .includes(keywordSearch);
          const locationMatch = job.locations?.some((loc) =>
            loc.toLowerCase().includes(keywordSearch)
          );
          const descMatch = job.jobScope?.toLowerCase().includes(keywordSearch);

          return titleMatch || companyMatch || locationMatch || descMatch;
        });
      }

      // Transform the filtered API response to match our current UI format
      return filteredJobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.companyName,
        companyLogoUrl: this.formatImageUrl(job.companyLogoUrl),
        location: job.locations
          ? job.locations.join(', ')
          : 'Multiple locations',
        salary: this.formatSalary(job.salary, job.salaryType),
        type: this.formatJobTitleType(job.jobTitleType),
        dates: this.formatDateRange(job.earliestStartDate, job.latestEndDate),
        postedTime: this.getTimeSincePosted(job.createdAt),
        jobTitle: job.jobTitleType,
        recruiterType: this.formatRecruiterType(job.recruiterType),
        benefits: this.formatBenefits(job.benefits),
        saved: false,
        ...(job.distance !== undefined && { distance: job.distance }),
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }

  // Get jobs near me (requires authentication)
  static async getJobsNearMe(distance, baseParams = {}) {
    try {
      // Add distance parameter
      const params = { ...baseParams, distance };

      // Get the authentication token from storage
      const token = this.getAuthToken();

      if (!token) {
        console.warn(
          'No authentication token found for near-me API, falling back to public API'
        );
        // If no token is available, fall back to the public API
        const response = await axios.get(`${this.API_URL}/jobs/public`, {
          params,
        });

        if (
          response.data &&
          response.data.statusCode === 200 &&
          response.data.data
        ) {
          // Transform the API response to match our current UI format
          const apiJobs = response.data.data.content || [];

          return apiJobs.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.companyName,
            companyLogoUrl: this.formatImageUrl(job.companyLogoUrl),
            location: job.locations
              ? job.locations.join(', ')
              : 'Multiple locations',
            salary: this.formatSalary(job.salary, job.salaryType),
            type: this.formatJobTitleType(job.jobTitleType),
            dates: this.formatDateRange(
              job.earliestStartDate,
              job.latestEndDate
            ),
            postedTime: this.getTimeSincePosted(job.createdAt),
            jobTitle: job.jobTitleType,
            recruiterType: this.formatRecruiterType(job.recruiterType),
            benefits: this.formatBenefits(job.benefits),
            saved: false,
            ...(job.distance !== undefined && { distance: job.distance }),
          }));
        }
        return [];
      }

      const headers = { Authorization: token };

      console.log('Using token for near-me API:', token);

      const response = await axios.get(
        `${this.API_URL}/jobs/candidate/near-me`,
        {
          params,
          headers,
        }
      );

      if (
        response.data &&
        response.data.statusCode === 200 &&
        response.data.data
      ) {
        // Transform the API response to match our current UI format
        const apiJobs = response.data.data.content || [];

        return apiJobs.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.companyName,
          companyLogoUrl: this.formatImageUrl(job.companyLogoUrl),
          location: job.locations
            ? job.locations.join(', ')
            : 'Multiple locations',
          salary: this.formatSalary(job.salary, job.salaryType),
          type: this.formatJobTitleType(job.jobTitleType),
          dates: this.formatDateRange(job.earliestStartDate, job.latestEndDate),
          postedTime: this.getTimeSincePosted(job.createdAt),
          jobTitle: job.jobTitleType,
          recruiterType: this.formatRecruiterType(job.recruiterType),
          benefits: this.formatBenefits(job.benefits),
          saved: false,
          ...(job.distance !== undefined && { distance: job.distance }),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching nearby jobs:', error);
      return [];
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Get auth token from storage/state
  static getAuthToken() {
    // Try different possible token key names used in the system
    const possibleKeys = [
      'auth_token',
      'token',
      'accessToken',
      'access_token',
      'jwt',
    ];

    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        return token;
      }
    }

    // If no token found in localStorage, try to check if there's a token in sessionStorage
    for (const key of possibleKeys) {
      const token = sessionStorage.getItem(key);
      if (token) {
        return token;
      }
    }

    console.warn('No authentication token found in storage');
    return null;
  }

  // Get count of all jobs matching filters
  static async getAllJobsCount(filters = {}) {
    try {
      // Store keyword search for client-side filtering
      const keywordSearch = filters.keywords
        ? filters.keywords.toLowerCase()
        : '';

      // Build query parameters for count - excluding keywords
      let params = { page: 0, size: 1000 }; // Get more jobs for accurate counting with client-side filtering

      // Add filters if provided (same as getJobs method)
      if (filters.jobTitle?.value) {
        params.jobTitleType = filters.jobTitle.value;
      }

      if (filters.minSalary) {
        params.minSalary = filters.minSalary;
      }

      if (filters.maxSalary) {
        params.maxSalary = filters.maxSalary;
      }

      if (filters.location) {
        params.location = filters.location;
      }

      if (filters.startDate) {
        params.startDate = this.formatDate(filters.startDate);
      }

      if (filters.endDate) {
        params.endDate = this.formatDate(filters.endDate);
      }

      // Add date posted filter (handle at the frontend)
      if (filters.datePosted?.value) {
        const today = new Date();
        let startDateFilter = new Date();

        switch (filters.datePosted.value) {
          case 'today':
            // Just use today's date as startDate, which is already set
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'yesterday':
            startDateFilter.setDate(today.getDate() - 1);
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'last3Days':
            startDateFilter.setDate(today.getDate() - 3);
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'lastWeek':
            startDateFilter.setDate(today.getDate() - 7);
            params.startDate = this.formatDate(startDateFilter);
            break;
          case 'lastMonth':
            startDateFilter.setMonth(today.getMonth() - 1);
            params.startDate = this.formatDate(startDateFilter);
            break;
        }
      }

      // Use a different endpoint if distance filter is active and greater than 0
      let apiJobs = [];
      if (filters.distance && filters.distance > 0) {
        const token = this.getAuthToken();

        if (!token) {
          console.warn(
            'No authentication token found for near-me count API, falling back to public API'
          );
          // If no token is available, fall back to the public API
          const response = await axios.get(`${this.API_URL}/jobs/public`, {
            params,
          });

          if (
            response.data &&
            response.data.statusCode === 200 &&
            response.data.data
          ) {
            apiJobs = response.data.data.content || [];
          }
        } else {
          // Make the API call with the auth token
          const headers = { Authorization: token };

          try {
            const response = await axios.get(
              `${this.API_URL}/jobs/candidate/near-me`,
              {
                params: { ...params, distance: filters.distance },
                headers,
              }
            );

            if (
              response.data &&
              response.data.statusCode === 200 &&
              response.data.data
            ) {
              apiJobs = response.data.data.content || [];
            }
          } catch (error) {
            console.error(
              'Error with near-me count API, falling back to public API:',
              error
            );
            // Fall back to public API if near-me fails
            const response = await axios.get(`${this.API_URL}/jobs/public`, {
              params,
            });

            if (
              response.data &&
              response.data.statusCode === 200 &&
              response.data.data
            ) {
              apiJobs = response.data.data.content || [];
            }
          }
        }
      } else {
        // Make the API call to get all jobs for counting
        const response = await axios.get(`${this.API_URL}/jobs/public`, {
          params,
        });

        if (
          response.data &&
          response.data.statusCode === 200 &&
          response.data.data
        ) {
          apiJobs = response.data.data.content || [];
        }
      }

      // Filter jobs by keyword search on client side if needed
      if (keywordSearch) {
        apiJobs = apiJobs.filter((job) => {
          const titleMatch = job.title?.toLowerCase().includes(keywordSearch);
          const companyMatch = job.companyName
            ?.toLowerCase()
            .includes(keywordSearch);
          const locationMatch = job.locations?.some((loc) =>
            loc.toLowerCase().includes(keywordSearch)
          );
          const descMatch = job.jobScope?.toLowerCase().includes(keywordSearch);

          return titleMatch || companyMatch || locationMatch || descMatch;
        });
      }

      // Return the count after client-side filtering
      return apiJobs.length;
    } catch (error) {
      console.error('Error fetching job count:', error);
      return 0;
    }
  }

  // Get detailed job information by ID
  static async getJobById(jobId) {
    try {
      const response = await axios.get(`${this.API_URL}/jobs/public/${jobId}`);

      if (
        response.data &&
        response.data.statusCode === 200 &&
        response.data.data
      ) {
        const job = response.data.data;

        // Transform API job detail into the format expected by our UI
        return {
          id: job.id,
          title: job.title,
          company: job.companyName,
          companyLogoUrl: this.formatImageUrl(job.companyLogoUrl),
          location: this.getLocationsFromSchedules(job.jobSchedules),
          salary: this.formatSalary(job.salary, job.salaryType),
          paymentTerms: job.paymentTerms,
          type: this.formatJobTitleType(job.jobTitleType),
          dates: this.getDateRangeFromSchedules(job.jobSchedules),
          description: job.jobScope,
          requirements: this.formatRequirements(job.requirements),
          benefits: this.formatBenefits(job.benefits),
          jobTitle: job.jobTitleType,
          recruiterType: this.formatRecruiterType(job.recruiterType),
          postedTime: this.getTimeSincePosted(job.createdAt),
          schedules: job.jobSchedules,
          totalPositions: this.getTotalPositionsFromSchedules(job.jobSchedules),
          availablePositions: this.getAvailablePositionsFromSchedules(
            job.jobSchedules
          ),
          saved: false,
          recruiterId: job.recruiterId,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }

  // Apply for a job
  static async applyForJob(jobId, candidateData) {
    try {
      console.log('Applying for job', jobId, 'with data', candidateData);

      return { success: true, message: 'Application submitted successfully' };
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }

  // Save/unsave a job
  static async saveJob(jobId, save = true) {
    try {
      // This will be implemented when we have the save job endpoint
      console.log(save ? 'Saving job' : 'Unsaving job', jobId);

      // For now, return a mock success response
      return { success: true };
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  // Get filter options
  static getFilterOptions() {
    return {
      workTypes: [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'ONE_TIME', label: 'One-time Event' },
      ],
      jobTitles: [
        { value: 'PROMOTER', label: 'Promoter' },
        { value: 'BRAND_AMBASSADOR', label: 'Brand Ambassador' },
        { value: 'USHER', label: 'Usher' },
        { value: 'SUPERVISOR', label: 'Supervisor' },
        { value: 'SETUP_CREW', label: 'Setup Crew' },
        { value: 'MASCOT_CREW', label: 'Mascot Crew' },
        { value: 'EVENT_CREW', label: 'Event Crew' },
        { value: 'OTHER', label: 'Other' },
      ],
      states: [
        { value: 'SELANGOR', label: 'Selangor' },
        { value: 'KUALA_LUMPUR', label: 'Kuala Lumpur' },
        { value: 'JOHOR', label: 'Johor' },
        { value: 'PENANG', label: 'Penang' },
        { value: 'PERAK', label: 'Perak' },
        { value: 'NEGERI_SEMBILAN', label: 'Negeri Sembilan' },
        { value: 'PAHANG', label: 'Pahang' },
        { value: 'MELAKA', label: 'Melaka' },
        { value: 'KEDAH', label: 'Kedah' },
        { value: 'KELANTAN', label: 'Kelantan' },
        { value: 'TERENGGANU', label: 'Terengganu' },
        { value: 'PERLIS', label: 'Perlis' },
        { value: 'SABAH', label: 'Sabah' },
        { value: 'SARAWAK', label: 'Sarawak' },
      ],
    };
  }

  // Helper methods
  static formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
  }

  static formatSalary(amount, type) {
    if (!amount || type === 'NEGOTIABLE') return 'Negotiable';

    const formattedAmount = amount.toFixed(2);

    switch (type) {
      case 'PER_HOUR':
        return `RM ${formattedAmount} per hour`;
      case 'PER_DAY':
        return `RM ${formattedAmount} per day`;
      case 'PER_EVENT':
        return `RM ${formattedAmount} per event`;
      case 'COMMISSION':
        return `RM ${formattedAmount} commission-based`;
      case 'FIXED':
        return `RM ${formattedAmount} fixed`;
      case 'PER_MONTH':
        return `RM ${formattedAmount} per month`;
      default:
        return `RM ${formattedAmount}`;
    }
  }

  static formatDateRange(startDate, endDate) {
    if (!startDate && !endDate) return 'Flexible dates';
    if (startDate && !endDate)
      return `From ${this.formatReadableDate(startDate)}`;
    if (!startDate && endDate)
      return `Until ${this.formatReadableDate(endDate)}`;

    if (startDate === endDate) {
      return this.formatReadableDate(startDate);
    }

    return `${this.formatReadableDate(startDate)} - ${this.formatReadableDate(
      endDate
    )}`;
  }

  static formatReadableDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  static getTimeSincePosted(dateString) {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor((now - postedDate) / (1000 * 60 * 60));
      if (diffInHours === 0) {
        return 'Just now';
      }
      return `${diffInHours}h`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d`;
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths}mo`;
    }
  }

  static formatRequirements(requirementsText) {
    if (!requirementsText) return [];

    // Split by newline and filter out empty lines
    return requirementsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  static formatBenefits(benefitsText) {
    if (!benefitsText) return [];

    // Split by newline and filter out empty lines
    return benefitsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  static getLocationsFromSchedules(schedules) {
    if (!schedules || schedules.length === 0) return 'Multiple locations';

    // Extract unique location names from all schedule dates and job locations
    const locationSet = new Set();

    schedules.forEach((schedule) => {
      if (schedule.scheduleDates) {
        schedule.scheduleDates.forEach((date) => {
          if (date.jobLocations) {
            date.jobLocations.forEach((location) => {
              if (location.locationName) {
                locationSet.add(location.locationName);
              }
            });
          }
        });
      }
    });

    return Array.from(locationSet).join(', ') || 'Multiple locations';
  }

  static getDateRangeFromSchedules(schedules) {
    if (!schedules || schedules.length === 0) return 'Flexible dates';

    let earliestDate = null;
    let latestDate = null;

    schedules.forEach((schedule) => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);

      if (!earliestDate || startDate < earliestDate) {
        earliestDate = startDate;
      }

      if (!latestDate || endDate > latestDate) {
        latestDate = endDate;
      }
    });

    if (!earliestDate || !latestDate) return 'Flexible dates';

    return this.formatDateRange(
      this.formatDate(earliestDate),
      this.formatDate(latestDate)
    );
  }

  static getTotalPositionsFromSchedules(schedules) {
    if (!schedules || schedules.length === 0) return 0;

    let total = 0;

    schedules.forEach((schedule) => {
      total += schedule.numPositions || 0;
    });

    return total;
  }

  static getAvailablePositionsFromSchedules(schedules) {
    if (!schedules || schedules.length === 0) return 0;

    let available = 0;

    schedules.forEach((schedule) => {
      if (schedule.scheduleDates) {
        schedule.scheduleDates.forEach((date) => {
          if (date.jobLocations) {
            date.jobLocations.forEach((location) => {
              available +=
                location.positionsNeeded - location.positionsFilled || 0;
            });
          }
        });
      }
    });

    return available;
  }

  // Format jobTitleType from backend enum to user-friendly display format
  static formatJobTitleType(jobTitleType) {
    if (!jobTitleType) return '';

    const formatMap = {
      PROMOTER: 'Promoter',
      SUPERVISOR: 'Supervisor',
      SETUP_CREW: 'Setup Crew',
      MASCOT_CREW: 'Mascot Crew',
      BRAND_AMBASSADOR: 'Brand Ambassador',
      EVENT_CREW: 'Event Crew',
      USHER: 'Usher',
      OTHER: 'Other',
    };

    return formatMap[jobTitleType] || jobTitleType;
  }

  // Format recruiterType from backend enum to user-friendly display format
  static formatRecruiterType(recruiterType) {
    if (!recruiterType) return '';

    const formatMap = {
      INDIVIDUAL: 'Individual',
      FREELANCE: 'Freelance',
      AGENCY: 'Agency',
      COMPANY: 'Company',
    };

    return formatMap[recruiterType] || recruiterType;
  }

  // Format image URLs
  static formatImageUrl(url) {
    if (!url) return null;

    // If it's already an absolute URL, check if it's on the dev server or backend
    if (url.startsWith('http')) {
      // If it's on the dev server, convert it to the backend URL
      if (url.includes('localhost:5173')) {
        // Extract the filename and determine the type
        if (url.includes('company-logos')) {
          const filename = url.split('/').pop();
          return fileService.getCompanyLogoUrl(filename);
        }
        // For other types, extract the filename and use generic handling
        const filename = url.split('/').pop();
        return `${this.API_URL}/files/${filename}`;
      }
      // Return it unchanged if it's already on the backend
      if (url.includes('localhost:8080')) {
        return url;
      }
    }

    // Check for company logos in different formats
    if (url.includes('company-logos') || url.includes('companyLogos')) {
      return fileService.getCompanyLogoUrl(url);
    }

    // Handle paths that start with /assets/profile-pictures/
    if (
      url.includes('/assets/profile-pictures/') ||
      url.includes('assets/profile-pictures/')
    ) {
      // Extract just the filename
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      // Return the correct path to the local assets directory
      return fileService.getProfilePictureUrl(filename);
    }

    // If it's a relative URL starting with a slash
    if (url.startsWith('/')) {
      // Check if it's a company logo
      if (url.includes('/company-logos/')) {
        return fileService.getCompanyLogoUrl(url);
      }

      // Remove the leading slash if present
      const cleanUrl = url.startsWith('/') ? url.substring(1) : url;

      // Check if it's an API path
      if (cleanUrl.startsWith('api/')) {
        return `http://localhost:8080/${cleanUrl}`;
      }

      return `${window.location.origin}/${cleanUrl}`;
    }

    // For just filenames, check if they might be company logos based on context
    if (
      !url.includes('/') &&
      (url.toLowerCase().includes('logo') ||
        url.toLowerCase().includes('company'))
    ) {
      return fileService.getCompanyLogoUrl(url);
    }

    // Otherwise, assume it's a relative path and prepend the base URL
    return `${this.API_URL}/files/${url}`;
  }
}

export default JobService;
