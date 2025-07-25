<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BankController extends Controller
{
    public function index(Request $request)
    {
        // 1. grab the search term (or null)
        $search = $request->query('search');

        // 2. build a query scoped to the current user
        $query = auth()->user()->banks();

        // 3. if they searched, filter by name or email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 4. paginate & keep the ?search= in all links
        $banks = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(['search' => $search]);

        // 5. render and pass back the current filter
        return Inertia::render('Banks/Index', [
            'banks' => $banks,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('Banks/Create', [
            'types' => [
                ['value' => 'customer', 'label' => 'Customer Bank'],
                ['value' => 'factory', 'label' => 'Factory Bank'],
                ['value' => 'shipper', 'label' => 'Shipper Bank'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'bank_type' => 'required|in:customer,factory,shipper',
            'name' => 'required|string|max:255',
            'swift_code' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        auth()->user()->banks()->create($data);

        return Redirect::route('banks.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Bank created.',
                'type' => 'success',
            ]);
    }

    public function edit(Bank $bank)
    {
        if ($bank->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Banks/Edit', [
            'bank' => $bank,
            'types' => [
                ['value' => 'customer', 'label' => 'Customer Bank'],
                ['value' => 'factory', 'label' => 'Factory Bank'],
                ['value' => 'shipper', 'label' => 'Shipper Bank'],
            ],
        ]);
    }

    public function update(Request $request, Bank $bank)
    {
        if ($bank->user_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'bank_type' => 'required|in:customer,factory,shipper',
            'name' => 'required|string|max:255',
            'swift_code' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $bank->update($data);

        return Redirect::route('banks.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Bank updated.',
                'type' => 'success',
            ]);
    }

    public function destroy(Bank $bank)
    {
        if ($bank->user_id !== auth()->id()) {
            abort(403);
        }

        $bank->delete();

        return Redirect::route('banks.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Bank deleted.',
                'type' => 'success',
            ]);
    }
}