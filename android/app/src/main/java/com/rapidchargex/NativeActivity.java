package com.rapidchargex;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.rapaidchargex.R;

public class NativeActivity extends AppCompatActivity {

    TextView userLatitudeTextView = null;
    TextView userLongitudeTextView = null;
    TextView destinationLatitudeTextView = null;
    TextView destinationLongitudeTextView = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_native);

        TextView textView = findViewById(R.id.native_text_view);
        userLatitudeTextView = findViewById(R.id.native_user_latitude);
        userLongitudeTextView = findViewById(R.id.native_user_longitude);
        destinationLatitudeTextView = findViewById(R.id.native_destination_latitude);
        destinationLongitudeTextView = findViewById(R.id.native_destination_longitude);

        Intent intent = getIntent();
        Double userCurrLat = intent.getDoubleExtra("userLatitude", 0.0d);
        Double userCurrLon = intent.getDoubleExtra("userLongitude", 0.0d);
        Double userDestLat = intent.getDoubleExtra("destinationLatitude", 0.0d);
        Double userDestLon = intent.getDoubleExtra("destinationLongitude", 0.0d);

        textView.setText("Hello From Native Android Screen. The Real OG of Android Development");
        userLatitudeTextView.setText("User Current Latitude ="+" "+ userCurrLat);
        userLongitudeTextView.setText("User Current Latitude ="+" "+ userCurrLon);
        destinationLatitudeTextView.setText("Expected Destination Latitude ="+" "+ userDestLat);
        destinationLongitudeTextView.setText("Expected Destination Latitude ="+" "+ userDestLon);
//        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
//            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
//            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
//            return insets;
//        });

    }
}