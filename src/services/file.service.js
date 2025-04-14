import { apiClient } from './api.service';

// Base URL for API requests
const API_URL = 'http://localhost:8080/api';

/**
 * Service to handle file-related operations
 */
class FileService {
  /**
   * Get the full URL for a file
   *
   * @param {string} path - The file path from the API
   * @returns {string} - The full URL to access the file
   */
  getFileUrl(path) {
    if (!path) return null;

    // If the path already starts with http/https
    if (path.startsWith('http')) {
      // If it's pointing to the backend, return as is
      if (path.includes('localhost:8080')) {
        return path;
      }

      // For any URLs that aren't pointing to our backend (including localhost:5173),
      // extract just the filename and use our backend URL
      const filename = path.split('/').pop();

      // Determine the type of file from the path
      if (path.includes('working-photos')) {
        return `${API_URL}/files/working-photos/${filename}`;
      } else if (path.includes('profile-pictures')) {
        return `${API_URL}/files/profile-pictures/${filename}`;
      } else if (path.includes('comcards')) {
        return `${API_URL}/files/comcards/${filename}`;
      } else if (path.includes('resumes')) {
        return `${API_URL}/files/resumes/${filename}`;
      } else if (path.includes('company-logos')) {
        return `${API_URL}/files/company-logos/${filename}`;
      } else if (path.includes('portfolio-media')) {
        return `${API_URL}/files/portfolio-media/${filename}`;
      } else if (path.includes('samples')) {
        return `http://localhost:8080/samples/${filename}`;
      } else {
        // Default case - use files endpoint
        return `${API_URL}/files/${filename}`;
      }
    }

    // If the path contains blob: prefix, it's a blob URL that should be used as is
    if (path.includes('blob:')) return path;

    // If it's already a path that starts with /api, add the base domain
    if (path.startsWith('/api')) {
      // Remove the /api prefix if the API_URL already includes it
      const cleanPath = path.startsWith('/api/') ? path.substring(4) : path;
      // Ensure we don't have double slashes by removing trailing slash from API_URL
      return `${API_URL.replace(/\/$/, '')}/${cleanPath.replace(/^\//, '')}`;
    }

    // For paths that start with /files
    if (path.startsWith('/files/')) {
      // Ensure we don't have double slashes
      return `${API_URL.replace(/\/$/, '')}${path}`;
    }

    // Convert frontend sample paths to backend sample paths
    if (path.includes('/assets/samples/')) {
      const filename = path.split('/').pop();
      return this.getSampleImageUrl(filename);
    }

    // For legacy paths that use the /assets structure, convert to new API path
    if (path.includes('/profile-pictures/')) {
      const filename = path.split('/').pop();
      return `${API_URL}/files/profile-pictures/${filename}`;
    }

    if (path.includes('/working-photos/')) {
      const filename = path.split('/').pop();
      return `${API_URL}/files/working-photos/${filename}`;
    }

    if (path.includes('/comcards/')) {
      const filename = path.split('/').pop();
      return `${API_URL}/files/comcards/${filename}`;
    }

    if (path.includes('/company-logos/')) {
      const filename = path.split('/').pop();
      return `${API_URL}/files/company-logos/${filename}`;
    }

    if (path.includes('/portfolio-media/')) {
      const filename = path.split('/').pop();
      return `${API_URL}/files/portfolio-media/${filename}`;
    }

    if (path.includes('/resumes/')) {
      const filename = path.split('/').pop();
      return `${API_URL}/files/resumes/${filename}`;
    }

    // If it's a relative path, assume it's relative to API files endpoint
    if (!path.startsWith('/')) {
      return `${API_URL}/files/${path}`;
    }

    // Default case: ensure we don't have double slashes when joining paths
    return `${API_URL.replace(/\/$/, '')}${path}`;
  }

  /**
   * Get profile picture URL
   * @param {string} filename - The filename or path of the profile picture
   * @returns {string} - The full URL to access the profile picture
   */
  getProfilePictureUrl(filename) {
    if (!filename) return null;

    // If it's a blob URL, return it as is
    if (filename.includes('blob:')) return filename;

    // If it's an already formed URL from another domain, extract just the filename
    if (filename.startsWith('http') && !filename.includes('localhost:8080')) {
      filename = filename.split('/').pop();
    }

    // For full paths that already contain profile-pictures
    if (filename.includes('profile-pictures/')) {
      return this.getFileUrl(filename);
    }

    // For just filenames
    return this.getFileUrl(`files/profile-pictures/${filename}`);
  }

  /**
   * Get resume URL
   * @param {string} filename - The filename or path of the resume
   * @returns {string} - The full URL to access the resume
   */
  getResumeUrl(filename) {
    if (!filename) return null;

    // If it's a blob URL, return it as is
    if (filename.includes('blob:')) return filename;

    // If it's an already formed URL from another domain, extract just the filename
    if (filename.startsWith('http') && !filename.includes('localhost:8080')) {
      filename = filename.split('/').pop();
    }

    // For full paths that already contain resumes
    if (filename.includes('resumes/')) {
      return this.getFileUrl(filename);
    }

    // For just filenames
    return this.getFileUrl(`files/resumes/${filename}`);
  }

  /**
   * Get comp card URL
   * @param {string} filename - The filename or path of the comp card
   * @returns {string} - The full URL to access the comp card
   */
  getCompcardUrl(filename) {
    if (!filename) return null;

    // If it's a blob URL, return it as is
    if (filename.includes('blob:')) return filename;

    // If it's an already formed URL from another domain, extract just the filename
    if (filename.startsWith('http') && !filename.includes('localhost:8080')) {
      filename = filename.split('/').pop();
    }

    // For full paths that already contain comcards
    if (filename.includes('comcards/')) {
      return this.getFileUrl(filename);
    }

    // For just filenames
    return this.getFileUrl(`files/comcards/${filename}`);
  }

  /**
   * Get working photo URL
   * @param {string} filename - The filename or path of the working photo
   * @returns {string} - The full URL to access the working photo
   */
  getWorkingPhotoUrl(filename) {
    if (!filename) return null;

    // If the path contains blob: prefix, it's a blob URL that should be used as is
    if (filename.includes('blob:')) return filename;

    // If it's an already formed URL from another domain, extract just the filename
    if (filename.startsWith('http') && !filename.includes('localhost:8080')) {
      filename = filename.split('/').pop();
    }

    // Clean the path from any prefixes
    let cleanFilename = filename;

    // If the path includes "api/files" strings, extract just the filename
    if (filename.includes('api/files/working-photos/')) {
      cleanFilename = filename.split('api/files/working-photos/').pop();
    }
    // For paths that already contain working-photos
    else if (filename.includes('working-photos/')) {
      cleanFilename = filename.split('working-photos/').pop();
    }

    // Remove any leading slashes to prevent double slashes
    cleanFilename = cleanFilename.replace(/^\/+/, '');

    // Return the URL with the correct API base
    return `${API_URL}/files/working-photos/${cleanFilename}`;
  }

  /**
   * Get sample image URL from backend
   * @param {string} filename - The filename or path of the sample image
   * @returns {string} - The full URL to access the sample image
   */
  getSampleImageUrl(filename) {
    if (!filename) return null;

    // If the path already starts with http and points to our backend, it's already a full URL
    if (filename.startsWith('http') && filename.includes('localhost:8080'))
      return filename;

    // Extract just the filename if it includes a path
    let cleanFilename = filename;
    if (filename.includes('/')) {
      cleanFilename = filename.split('/').pop();
    }

    // Remove any leading slashes
    cleanFilename = cleanFilename.replace(/^\/+/, '');

    // For comp-card-example, use comp-card-sample
    if (cleanFilename === 'comp-card-example.jpg') {
      cleanFilename = 'comp-card-sample.jpg';
    }

    // Return direct URL to sample image on backend (no /api prefix)
    return `http://localhost:8080/samples/${cleanFilename}`;
  }

  /**
   * Convert a frontend asset path to a backend API path
   * @param {string} path - The frontend path (e.g. /src/assets/samples/comp-card-example.jpg)
   * @returns {string} - The backend API path
   */
  convertAssetPathToApiPath(path) {
    if (!path) return null;

    // If it's already an API path, return as is
    if (path.includes('/api/files/')) return path;

    // If it's an already formed URL from port 5173 or any non-8080 domain, extract just the filename
    if (path.startsWith('http') && !path.includes('localhost:8080')) {
      const filename = path.split('/').pop();

      // Determine the type of file based on the path
      if (path.includes('working-photos')) {
        return `${API_URL}/files/working-photos/${filename}`;
      } else if (path.includes('profile-pictures')) {
        return `${API_URL}/files/profile-pictures/${filename}`;
      } else if (path.includes('comcards')) {
        return `${API_URL}/files/comcards/${filename}`;
      } else if (path.includes('company-logos')) {
        return `${API_URL}/files/company-logos/${filename}`;
      } else if (path.includes('portfolio-media')) {
        return `${API_URL}/files/portfolio-media/${filename}`;
      } else if (path.includes('resumes')) {
        return `${API_URL}/files/resumes/${filename}`;
      } else if (path.includes('samples')) {
        return `http://localhost:8080/samples/${filename}`;
      }
    }

    // If it's already a complete backend URL, return as is
    if (path.startsWith('http') && path.includes('localhost:8080')) {
      return path;
    }

    // Handle sample paths
    if (
      path.includes('/assets/samples/') ||
      path.includes('src/assets/samples/')
    ) {
      const filename = path.split('/').pop();
      return this.getSampleImageUrl(filename);
    }

    // Handle different file types
    if (
      path.includes('/assets/profile-pictures/') ||
      path.includes('src/assets/profile-pictures/')
    ) {
      const filename = path.split('/').pop();
      return this.getProfilePictureUrl(filename);
    }

    if (
      path.includes('/assets/working-photos/') ||
      path.includes('src/assets/working-photos/')
    ) {
      const filename = path.split('/').pop();
      return this.getWorkingPhotoUrl(filename);
    }

    if (
      path.includes('/assets/comcards/') ||
      path.includes('src/assets/comcards/')
    ) {
      const filename = path.split('/').pop();
      return this.getCompcardUrl(filename);
    }

    if (
      path.includes('/assets/company-logos/') ||
      path.includes('src/assets/company-logos/')
    ) {
      const filename = path.split('/').pop();
      return this.getCompanyLogoUrl(filename);
    }

    if (
      path.includes('/assets/portfolio-media/') ||
      path.includes('src/assets/portfolio-media/')
    ) {
      const filename = path.split('/').pop();
      return this.getPortfolioMediaUrl(filename);
    }

    if (
      path.includes('/assets/resumes/') ||
      path.includes('src/assets/resumes/')
    ) {
      const filename = path.split('/').pop();
      return this.getResumeUrl(filename);
    }

    // Default case: just use the filename as is
    const filename = path.split('/').pop();
    return this.getFileUrl(`files/${filename}`);
  }

  /**
   * Get company logo URL
   * @param {string} filename - The filename or path of the company logo
   * @returns {string} - The full URL to access the company logo
   */
  getCompanyLogoUrl(filename) {
    if (!filename) return null;

    // If it's a blob URL, return it as is
    if (filename.includes('blob:')) return filename;

    // If it's an already formed URL from another domain, extract just the filename
    if (filename.startsWith('http') && !filename.includes('localhost:8080')) {
      filename = filename.split('/').pop();
    }

    // Clean the path from any prefixes
    let cleanFilename = filename;

    // If the path includes "api/files" strings, extract just the filename
    if (filename.includes('api/files/company-logos/')) {
      cleanFilename = filename.split('api/files/company-logos/').pop();
    }
    // For paths that already contain company-logos
    else if (filename.includes('company-logos/')) {
      cleanFilename = filename.split('company-logos/').pop();
    }

    // Remove any leading slashes to prevent double slashes
    cleanFilename = cleanFilename.replace(/^\/+/, '');

    // Return the URL with the correct API base
    return `${API_URL}/files/company-logos/${cleanFilename}`;
  }

  /**
   * Get portfolio media URL
   * @param {string} filename - The filename or path of the portfolio media
   * @returns {string} - The full URL to access the portfolio media
   */
  getPortfolioMediaUrl(filename) {
    if (!filename) return null;

    // If it's a blob URL, return it as is
    if (filename.includes('blob:')) return filename;

    // If it's an already formed URL from another domain, extract just the filename
    if (filename.startsWith('http') && !filename.includes('localhost:8080')) {
      filename = filename.split('/').pop();
    }

    // Clean the path from any prefixes
    let cleanFilename = filename;

    // If the path includes "api/files" strings, extract just the filename
    if (filename.includes('api/files/portfolio-media/')) {
      cleanFilename = filename.split('api/files/portfolio-media/').pop();
    }
    // For paths that already contain portfolio-media
    else if (filename.includes('portfolio-media/')) {
      cleanFilename = filename.split('portfolio-media/').pop();
    }

    // Remove any leading slashes to prevent double slashes
    cleanFilename = cleanFilename.replace(/^\/+/, '');

    // Return the URL with the correct API base
    return `${API_URL}/files/portfolio-media/${cleanFilename}`;
  }
}

export default new FileService();
