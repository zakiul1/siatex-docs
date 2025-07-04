<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckRoleAndPermissions;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Customer Routes
    Route::get('/customers', [CustomerController::class, 'index'])
        ->name('customers.index')->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.read");
    Route::get('/customers/create', [CustomerController::class, 'create'])
        ->name('customers.create')->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::post('/customers', [CustomerController::class, 'store'])
        ->name('customers.store')->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])
        ->name('customers.edit')->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])
        ->name('customers.update')->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])
        ->name('customers.destroy')->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.delete");

    //User Routes
    Route::resource('users', UserController::class)->names('users')
        ->middleware(CheckRoleAndPermissions::class . ":Super Admin");
    Route::get('/users/{user}/permissions', [PermissionController::class, 'edit'])
        ->name('users.permissions.edit')
        ->middleware(CheckRoleAndPermissions::class . ":Super Admin");
    Route::post('/users/{user}/permissions', [PermissionController::class, 'update'])
        ->name('users.permissions.update')
        ->middleware(CheckRoleAndPermissions::class . ":Super Admin");
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
