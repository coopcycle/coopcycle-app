beforeAll(async () => {
  await device.launchApp({
    permissions: {
      notifications: 'YES',
      location: 'always',
    }
  })
});
