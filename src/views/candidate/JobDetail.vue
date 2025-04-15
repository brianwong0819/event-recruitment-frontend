<router-link
  :to="{
    name: 'RecruiterInfo',
    params: { recruiterId: job.recruiterId },
    query: { jobId: job.id },
  }"
  class="text-lg text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors flex items-center gap-1"
  @click="saveCurrentJobId(job.id)"
>
    {{ job.company }}
    <i class="pi pi-external-link text-xs"></i>
  </router-link>

// Save current job ID to session storage for returning to this job later const
saveCurrentJobId = (jobId) => { if (jobId) { // Add debugging for the recruiter
ID console.log('Job details before navigation:', props.job);
console.log('Recruiter ID used for navigation:', props.job.recruiterId);
console.log('Type of recruiterId:', typeof props.job.recruiterId);
sessionStorage.setItem('lastViewedJobId', jobId); } };
