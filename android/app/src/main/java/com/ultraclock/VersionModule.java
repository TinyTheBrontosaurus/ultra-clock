package com.ultraclock;

import android.content.pm.PackageManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class VersionModule extends ReactContextBaseJavaModule {
    VersionModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "VersionModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        ReactApplicationContext context = this.getReactApplicationContext();

        final Map<String, Object> constants = new HashMap<>();

        String vname = "";
        try {
            vname = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        }
        catch(PackageManager.NameNotFoundException e) {
            vname = "NameNotFound";
        }
        constants.put("VERSION_STRING", vname);

        int vcode = 0;
        try {
            vcode = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode;
        }
        catch(PackageManager.NameNotFoundException e) {
            // Empty
        }

        constants.put("VERSION_CODE", vcode);
        return constants;
    }
}