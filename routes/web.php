<?php

use App\Http\Controllers\BankController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FactoryCategoryController;
use App\Http\Controllers\FactoryController;
use App\Http\Controllers\InvoiceController;            // remove this if no longer used
use App\Http\Controllers\SampleInvoiceController;
use App\Http\Controllers\SalesInvoiceController;
use App\Http\Controllers\InvoiceReportController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ShipperController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckRoleAndPermissions;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->route('dashboard'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard');

    // Customer Routes
    Route::get('/customers', [CustomerController::class, 'index'])
        ->name('customers.index')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.read");
    Route::get('/customers/create', [CustomerController::class, 'create'])
        ->name('customers.create')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::post('/customers', [CustomerController::class, 'store'])
        ->name('customers.store')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])
        ->name('customers.edit')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])
        ->name('customers.update')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.write");
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])
        ->name('customers.destroy')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.delete");

    // Shipper, Bank, Factory, Factory Category
    Route::resource('shippers', ShipperController::class);
    Route::resource('banks', BankController::class);
    Route::resource('factories', FactoryController::class);
    Route::post('/factory-categories', [FactoryCategoryController::class, 'store'])
        ->name('factory-categories.store');

    // -----------------------------
    // Invoice Submodules (NEW)
    // -----------------------------

    // Sample Invoice CRUD
    Route::resource('sample-invoices', SampleInvoiceController::class)
        ->names('sample-invoices')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sample-invoices.read|write|delete");
    // PDF download
    Route::get(
        'sample-invoices/{sample_invoice}/download',
        [SampleInvoiceController::class, 'download']
    )->name('sample-invoices.download')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sample-invoices.read");
    // PDF download
    Route::get(
        'sample-invoices/{sample_invoice}/download',
        [SampleInvoiceController::class, 'download']
    )->name('sample-invoices.download')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sample-invoices.read");
    // Sales Invoice CRUD
    Route::resource('sales-invoices', SalesInvoiceController::class)
        ->names('sales-invoices')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sales-invoices.read|write|delete");

    // Invoice Reports (read-only)
    Route::get('invoices/reports', [InvoiceReportController::class, 'index'])
        ->name('invoices.reports')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.invoices-reports.read");

    // (Optional) If you still need the old unified invoices:
    // Route::resource('invoices', InvoiceController::class);

    // (Optional) Preview route for unified invoices:
    // Route::post('invoices/preview', [InvoiceController::class, 'preview'])
    //     ->name('invoices.preview');

    // User & Permissions
    Route::resource('users', UserController::class)
        ->names('users')
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