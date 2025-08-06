<?php

use App\Http\Controllers\BankController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FactoryCategoryController;
use App\Http\Controllers\FactoryController;
// use App\Http\Controllers\InvoiceController; // remove if unused
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

    // Customers
    Route::resource('customers', CustomerController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.customers.read|write|delete");

    // Shippers, Banks, Factories
    Route::resource('shippers', ShipperController::class)
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.shippers.read|write|delete");
    Route::resource('banks', BankController::class)
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.banks.read|write|delete");
    Route::resource('factories', FactoryController::class)
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.factories.read|write|delete");
    Route::post('factory-categories', [FactoryCategoryController::class, 'store'])
        ->name('factory-categories.store')
        ->middleware(CheckRoleAndPermissions::class . ":User,secondary.factory-categories.write");

    // Sample Invoices
    Route::resource('sample-invoices', SampleInvoiceController::class)
        ->names('sample-invoices')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sample-invoices.read|write|delete");
    Route::get('sample-invoices/{sample_invoice}/download', [SampleInvoiceController::class, 'download'])
        ->name('sample-invoices.download')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sample-invoices.read");

    // Sales Invoices CRUD
    Route::resource('sales-invoices', SalesInvoiceController::class)
        ->names('sales-invoices')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sales-invoices.read|write|delete");

    //
    // ─── PREVIEW ROUTES ────────────────────────────────────────────────────────────
    //

    // 1) POST → Inertia/JSON preview (your Create/Edit pages should post to this)
    Route::post('sales-invoices/preview', [SalesInvoiceController::class, 'preview'])
        ->name('sales-invoices.preview-json')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sales-invoices.read");

    // 2) GET  → PDF‑stream or iframe preview (if you’re embedding it)
    Route::get('sales-invoices/{sales_invoice}/preview', [SalesInvoiceController::class, 'preview'])
        ->name('sales-invoices.preview')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sales-invoices.read");

    // Download final PDF
    Route::get('sales-invoices/{sales_invoice}/download', [SalesInvoiceController::class, 'download'])
        ->name('sales-invoices.download')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.sales-invoices.read");

    // Invoice Reports
    Route::get('invoices/reports', [InvoiceReportController::class, 'index'])
        ->name('invoices.reports')
        ->middleware(CheckRoleAndPermissions::class . ":User,primary.invoices.invoices-reports.read");

    // Users & Permissions
    Route::resource('users', UserController::class)
        ->names('users')
        ->middleware(CheckRoleAndPermissions::class . ":Super Admin");
    Route::get('users/{user}/permissions', [PermissionController::class, 'edit'])
        ->name('users.permissions.edit')
        ->middleware(CheckRoleAndPermissions::class . ":Super Admin");
    Route::post('users/{user}/permissions', [PermissionController::class, 'update'])
        ->name('users.permissions.update')
        ->middleware(CheckRoleAndPermissions::class . ":Super Admin");
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';