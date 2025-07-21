<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        // grab the incoming search term (if any)
        $search = $request->query('search');

        // base query scoped to the current user
        $query = auth()->user()->customers();

        // when there's a search term, filter by name, mobile or address
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // paginate, keep ?search= in links, newest first
        $customers = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(['search' => $search]);

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|unique:customers',
            'address' => 'nullable|string',
        ]);

        auth()->user()->customers()->create($data);

        return Redirect::route('customers.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Customer created.',
                'type' => 'success',
            ]);
    }

    public function edit(Customer $customer)
    {
        if ($customer->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        if ($customer->user_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => "required|string|unique:customers,mobile,{$customer->id}",
            'address' => 'nullable|string',
        ]);

        $customer->update($data);

        return Redirect::route('customers.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Customer updated.',
                'type' => 'success',
            ]);
    }

    public function destroy(Customer $customer)
    {
        if ($customer->user_id !== auth()->id()) {
            abort(403);
        }

        $customer->delete();

        return Redirect::route('customers.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Customer deleted.',
                'type' => 'success',
            ]);
    }
}