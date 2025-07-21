<?php

namespace App\Http\Controllers;

use App\Models\Factory;
use App\Models\FactoryCategory;
use App\Models\FactoryProfile;
use App\Models\FactoryCertificate;
use App\Models\FactoryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class FactoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = auth()->user()->factories()->with('category');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $factories = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(['search' => $search]);

        return Inertia::render('Factories/Index', [
            'factories' => $factories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        $categories = FactoryCategory::where('user_id', auth()->id())->get();
        return Inertia::render('Factories/Create', compact('categories'));
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:factory_categories,id',
            'profile' => 'nullable|file|mimes:pdf',
            'compliance' => 'nullable|string|max:255',
            'production_capacity' => 'nullable|integer',
            'certificates.*' => 'nullable|file|mimes:pdf,jpg,png',
            'images.*' => 'nullable|image',
        ]);

        $factory = auth()->user()->factories()->create([
            'name' => $data['name'],
            'address' => $data['address'],
            'contact' => $data['contact'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'compliance' => $data['compliance'] ?? null,
            'production_capacity' => $data['production_capacity'] ?? null,
        ]);

        // handle profile PDF
        if ($r->file('profile')) {
            $path = $r->file('profile')->store('factories/profiles', 'public');
            FactoryProfile::create([
                'factory_id' => $factory->id,
                'file_path' => $path,
            ]);
        }

        // handle certificates
        foreach ($r->file('certificates', []) as $file) {
            $path = $file->store('factories/certificates', 'public');
            FactoryCertificate::create([
                'factory_id' => $factory->id,
                'name' => $file->getClientOriginalName(),
                'file_path' => $path,
            ]);
        }

        // handle images
        foreach ($r->file('images', []) as $img) {
            $path = $img->store('factories/images', 'public');
            FactoryImage::create([
                'factory_id' => $factory->id,
                'file_path' => $path,
                'alt_text' => $img->getClientOriginalName(),
            ]);
        }

        return Redirect::route('factories.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Factory created.',
                'type' => 'success',
            ]);
    }

    public function edit(Factory $factory)
    {
        // ownership check
        if ($factory->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = FactoryCategory::where('user_id', auth()->id())->get();
        $factory->load('profile', 'certificates', 'images', 'category');

        return Inertia::render('Factories/Edit', compact('factory', 'categories'));
    }

    public function update(Request $r, Factory $factory)
    {
        // ownership check
        if ($factory->user_id !== auth()->id()) {
            abort(403);
        }

        $data = $r->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:factory_categories,id',
            'profile' => 'nullable|file|mimes:pdf',
            'compliance' => 'nullable|string|max:255',
            'production_capacity' => 'nullable|integer',
            'certificates.*' => 'nullable|file|mimes:pdf,jpg,png',
            'images.*' => 'nullable|image',
        ]);

        $factory->update($data);

        // replace profile if provided
        if ($r->file('profile')) {
            optional($factory->profile)->delete();
            Storage::disk('public')->delete($factory->profile->file_path);

            $path = $r->file('profile')->store('factories/profiles', 'public');
            $factory->profile()->updateOrCreate([], ['file_path' => $path]);
        }

        // add new certificates
        foreach ($r->file('certificates', []) as $file) {
            $path = $file->store('factories/certificates', 'public');
            FactoryCertificate::create([
                'factory_id' => $factory->id,
                'name' => $file->getClientOriginalName(),
                'file_path' => $path,
            ]);
        }

        // add new images
        foreach ($r->file('images', []) as $img) {
            $path = $img->store('factories/images', 'public');
            FactoryImage::create([
                'factory_id' => $factory->id,
                'file_path' => $path,
                'alt_text' => $img->getClientOriginalName(),
            ]);
        }

        return Redirect::route('factories.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Factory updated.',
                'type' => 'success',
            ]);
    }

    public function destroy(Factory $factory)
    {
        // ownership check
        if ($factory->user_id !== auth()->id()) {
            abort(403);
        }

        $factory->delete();

        return Redirect::route('factories.index')
            ->with('toast', [
                'title' => 'Deleted',
                'message' => 'Factory removed.',
                'type' => 'success',
            ]);
    }
}