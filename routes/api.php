<?php

use App\Http\Controllers\Api\NameColorController;
use App\Http\Controllers\Api\WordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('name-colors', NameColorController::class);
Route::apiResource('words', WordController::class);
Route::get('/finnfast-words', [WordController::class, 'apiWords']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
