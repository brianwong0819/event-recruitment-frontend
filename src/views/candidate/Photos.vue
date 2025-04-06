<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { onMounted, ref } from 'vue';

const compcardPhotos = ref([]);

const fetchPhotosDirectly = async () => {
  console.log('Fetching photos directly via fetch API');

  try {
    const token = localStorage.getItem('accessToken') || '';

    if (!token) {
      console.error('No auth token found for fetching photos');
      return;
    }

    const response = await fetch(
      'http://localhost:8080/api/candidate/file/comcard',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );

    console.log('Direct fetch response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Photos data received via direct fetch:', data);

      if (data && (data.data || data)) {
        let photos = Array.isArray(data.data || data)
          ? data.data || data
          : [data.data || data];

        console.log('Processing photos array:', photos);

        // Process each photo
        compcardPhotos.value = photos.map((photo) => {
          if (photo.comcardUrl) {
            const baseUrl = 'http://localhost:8080';
            const url = photo.comcardUrl.startsWith('http')
              ? photo.comcardUrl
              : photo.comcardUrl.startsWith('/')
              ? baseUrl + photo.comcardUrl
              : baseUrl + '/' + photo.comcardUrl;

            return { ...photo, url };
          } else if (photo.url) {
            return photo;
          } else {
            return { ...photo, url: null };
          }
        });
      } else {
        compcardPhotos.value = [];
      }
    } else {
      console.error(
        'Direct fetch failed:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error in direct fetch of photos:', error);
  }
};

onMounted(() => {
  fetchPhotosDirectly();
});
</script>
