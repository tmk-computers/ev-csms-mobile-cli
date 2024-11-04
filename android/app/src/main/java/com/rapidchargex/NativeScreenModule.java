package com.rapidchargex; // replace YOUR_APP_NAME

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class NativeScreenModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    NativeScreenModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "NativeScreen";
    }

    @ReactMethod
    public void openNativeScreen(double currentLatitude, double currentLongitude, double destinationLatitude, double destinationLongitude) {
         Intent intent = new Intent(reactContext, NativeActivity.class);
         intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
         intent.putExtra("userLatitude", currentLatitude);
         intent.putExtra("userLongitude", currentLongitude);
         intent.putExtra("destinationLatitude", destinationLatitude);
         intent.putExtra("destinationLongitude", destinationLongitude);
         reactContext.startActivity(intent);
        Log.d("Native1", "Test Check");
    }
}
