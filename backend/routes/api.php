<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/locations', [LocationController::class, 'index']);

// Protected routes (require auth token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/locations', [LocationController::class, 'store']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
});

Route::get('/init-db', function (Request $request) {
    if ($request->query('secret') !== 'iskcon_durgapur_secret_9988') {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
            '--seed' => true,
            '--force' => true,
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Database migrated and seeded successfully!',
            'output' => \Illuminate\Support\Facades\Artisan::output(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});
