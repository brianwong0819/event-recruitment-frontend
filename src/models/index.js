/**
 * User Authentication Interfaces
 */

// Common registration fields
export const userRegistration = {
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  }
  
  // Candidate-specific registration
  export const candidateRegistration = {
    ...userRegistration,
    name: '',
    gender: '',
    race: '',
    dateOfBirth: '',
    languages: []
  }
  
  // Recruiter-specific registration
  export const recruiterRegistration = {
    ...userRegistration,
    recruiterRepName: '',
    recruiterType: 'INDIVIDUAL',
    companyName: '',
    companyLocation: '',
    companyWebsite: ''
  }
  
  // Login request
  export const loginRequest = {
    username: '',
    password: ''
  }
  
  // JWT response from login
  export const jwtResponse = {
    token: '',
    refreshToken: '',
    tokenType: 'Bearer',
    userId: 0,
    username: '',
    userType: '',
    expiresIn: 0
  }
  
  /**
   * Candidate Profile Interfaces
   */
  export const candidateProfile = {
    id: 0,
    username: '',
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    race: '',
    profilePictureUrl: '',
    preferredLocation: '',
    availability: '',
    bio: '',
    resumeUrl: '',
    languages: [],
    experiences: [],
    workingPhotos: [],
    comcards: [],
    availabilityDates: []
  }
  
  // Candidate experience
  export const candidateExperience = {
    id: 0,
    jobType: '',
    experienceText: ''
  }
  
  // Working photo
  export const workingPhoto = {
    id: 0,
    photoUrl: '',
    description: '',
    uploadedAt: ''
  }
  
  // Comcard (identification card)
  export const comcard = {
    id: 0,
    comcardUrl: '',
    uploadedAt: ''
  }
  
  // Availability date
  export const availabilityDate = {
    id: 0,
    availableDate: ''
  }
  
  /**
   * Recruiter Profile Interfaces
   */
  export const recruiterProfile = {
    id: 0,
    username: '',
    recruiterRepName: '',
    email: '',
    phoneNumber: '',
    recruiterType: '',
    companyName: '',
    companyLogoUrl: '',
    companyDescription: '',
    companyLocation: '',
    companyWebsite: '',
    verificationStatus: '',
    portfolios: []
  }
  
  // Portfolio/event
  export const portfolio = {
    id: 0,
    eventName: '',
    eventStartDate: '',
    eventEndDate: '',
    eventDescription: '',
    uploadedAt: '',
    media: []
  }
  
  // Portfolio media
  export const eventMedia = {
    id: 0,
    mediaUrl: '',
    uploadedAt: ''
  }
  
  /**
   * Response Wrapper
   */
  export const response = {
    statusCode: 0,
    message: '',
    data: null
  }