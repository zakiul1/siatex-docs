<?php

namespace App\Http\Controllers;

use App\Models\FactoryCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class FactoryCategoryController extends Controller
{
    public function store(Request $r)
    {
        $r->validate(['name' => 'required|string|max:100|unique:factory_categories,name']);

        FactoryCategory::create([
            'user_id' => auth()->id(),
            'name' => $r->input('name'),
        ]);

        return Redirect::back()->with('toast', [
            'title' => 'Category Added',
            'message' => 'New category created.',
            'type' => 'success',
        ]);
    }
}