<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = auth()->user()->customers()->paginate(10);

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|unique:customers',
            'address' => 'nullable|string',
        ]);

        try {
            auth()->user()->customers()->create($request->only(['name', 'mobile', 'address']));
            $toast = [
                'title' => 'Success',
                'message' => 'Customer created successfully.',
                'type' => 'success',
            ];
            return Redirect::route('customers.index')->with('toast', $toast);
        } catch (Exception $e) {
            $toast = [
                'title' => 'Failed!',
                'message' => 'Failed to create customer. Please try again. ' . $e->getMessage(),
                'type' => 'error',
            ];
            return Redirect::back()->with('toast', $toast)->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return redirect()->route('customers.edit', $customer);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        if ($customer->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        if ($customer->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|unique:customers,mobile,' . $customer->id,
            'address' => 'nullable|string',
        ]);

        try {
            $customer->update($request->only(['name', 'mobile', 'address']));
            $toast = [
                'title' => 'Success',
                'message' => 'Customer updated successfully.',
                'type' => 'success',
            ];
            return Redirect::route('customers.index')->with('toast', $toast);
        } catch (Exception $e) {
            $toast = [
                'title' => 'Failed!',
                'message' => 'Failed to update customer. Please try again. ' . $e->getMessage(),
                'type' => 'error',
            ];
            return Redirect::back()->with('toast', $toast)->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        if ($customer->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            $customer->delete();
            $toast = [
                'title' => 'Success',
                'message' => 'Customer deleted successfully.',
                'type' => 'success',
            ];
            return Redirect::route('customers.index')->with('toast', $toast);
        } catch (Exception $e) {
            $toast = [
                'title' => 'Failed!',
                'message' => 'Failed to delete customer. Please try again. ' . $e->getMessage(),
                'type' => 'error',
            ];
            return Redirect::back()->with('toast', $toast)->withInput();
        }
    }
}
