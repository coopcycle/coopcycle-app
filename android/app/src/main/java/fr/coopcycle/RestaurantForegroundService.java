package fr.coopcycle;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * @see https://medium.com/reactbrasil/how-to-create-an-unstoppable-service-in-react-native-using-headless-js-93656b6fd5d1
 * @see https://github.com/mathias5r/rn-heartbeat
 * @see https://developer.android.com/guide/components/foreground-services
 * @see https://developer.android.com/reference/android/app/Service
 */
public class RestaurantForegroundService extends Service {

    private static final String TAG = "RestaurantForegroundService";

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "HEARTBEAT";

    private Handler handler = new Handler();

    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {

            Log.d(TAG, "runnable run");

            Context context = getApplicationContext();

            // Intent myIntent = new Intent(context, HeartbeatEventService.class);
            // context.startService(myIntent);
            // HeadlessJsTaskService.acquireWakeLockNow(context);

            // context
            //     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            //     .emit("Heartbeat", null);

            handler.postDelayed(this, 2000);
        }
    };

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "HEARTBEAT", importance);
            channel.setDescription("CHANEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Log.d(TAG, "onStartCommand startId = " + startId);

        this.handler.post(this.runnableCode);

        createNotificationChannel();

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Heartbeat service")
            .setContentText("Running...")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(contentIntent)
            .setOngoing(true)
            .build();

        startForeground(SERVICE_NOTIFICATION_ID, notification);

        return START_STICKY;
    }

}
