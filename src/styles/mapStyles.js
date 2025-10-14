export const lightMapStyle = [
    { elementType: 'labels.text.fill', stylers: [{ color: '#000000' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  ];
  
  export const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1d1d' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b0b0b' }] },
  ];
  