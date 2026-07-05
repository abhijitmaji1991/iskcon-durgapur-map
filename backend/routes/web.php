<?php

use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return file_get_contents($indexPath);
    }
    return response('Community Map Web App is building...', 200);
});
