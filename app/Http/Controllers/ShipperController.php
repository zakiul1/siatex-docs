<?php

namespace App\Http\Controllers;

use App\Models\Shipper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ShipperController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = auth()->user()->shippers();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $shippers = $query->paginate(10)->appends(['search' => $search]);

        // Only need shipper‑type banks for lookup
        $bankLookup = auth()->user()
            ->banks()
            ->where('bank_type', 'shipper')
            ->pluck('name', 'id')
            ->toArray();

        return Inertia::render('Shippers/Index', [
            'shippers' => $shippers,
            'filters' => ['search' => $search],
            'bankLookup' => $bankLookup,
        ]);
    }

    public function create()
    {
        $banks = auth()->user()
            ->banks()
            ->where('bank_type', 'shipper')
            ->get(['id', 'name']);

        return Inertia::render('Shippers/Create', [
            'banks' => $banks,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|unique:shippers,phone',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'mobile' => 'nullable|string|max:50',
            'bank_ids' => 'nullable|array',
            'bank_ids.*' => 'integer|exists:banks,id',
        ]);

        $data['user_id'] = auth()->id();

        Shipper::create($data);

        return Redirect::route('shippers.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Shipper created.',
                'type' => 'success',
            ]);
    }

    public function edit(Shipper $shipper)
    {
        if ($shipper->user_id !== auth()->id()) {
            abort(403);
        }

        $banks = auth()->user()
            ->banks()
            ->where('bank_type', 'shipper')
            ->get(['id', 'name']);

        return Inertia::render('Shippers/Edit', [
            'shipper' => $shipper,
            'banks' => $banks,
        ]);
    }

    public function update(Request $request, Shipper $shipper)
    {
        if ($shipper->user_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => "required|string|unique:shippers,phone,{$shipper->id}",
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'mobile' => 'nullable|string|max:50',
            'bank_ids' => 'nullable|array',
            'bank_ids.*' => 'integer|exists:banks,id',
        ]);

        $shipper->update($data);

        return Redirect::route('shippers.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Shipper updated.',
                'type' => 'success',
            ]);
    }

    public function destroy(Shipper $shipper)
    {
        if ($shipper->user_id !== auth()->id()) {
            abort(403);
        }

        $shipper->delete();

        return Redirect::route('shippers.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Shipper deleted.',
                'type' => 'success',
            ]);
    }
}