<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Utilities\TimezoneUtility;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::where('level', "<>", "Super Admin")->paginate(10); // You can adjust pagination as needed

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'level' => 'required|string',
            'password' => 'required|confirmed|min:8',
        ]);

        try {
            // Attempt to create a new CronUrl model
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'level' => $request->level,
                'password' => bcrypt($request->password),
            ]);
            // If creation is successful, create a success toast
            $toast = [
                'title' => 'Success',
                'message' => 'User Created successfully.',
                'type' => 'success',
            ];
            // Redirect to the index page with a success toast
            return Redirect::route('users.index')->with('toast', $toast);
        } catch (Exception $e) {
            // If an exception occurs during creation, create an error toast
            $toast = [
                'title' => 'Failed!',
                'message' => 'Failed to create User. Please try again.' .  $e->getMessage(),
                'type' => 'error',
            ];
            // Redirect back to the creation form with an error toast and input data
            return Redirect::back()->with('toast', $toast)->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Not typically used for user management in this context, but you can add it if needed
        // return Inertia::render('Users/Show', ['user' => $user]);
        return redirect()->route('users.edit', $user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'level' => 'required|string',
            'password' => 'nullable|confirmed|min:8', // Password update is optional
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->level = $request->level;
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        try {
            $user->save();
            $toast = [
                'title' => 'Success',
                'message' => 'User Updated successfully.',
                'type' => 'success',
            ];
            // Redirect to the index page with a success toast
            return Redirect::route('users.index')->with('toast', $toast);
        } catch (\Exception $th) {
            //throw $th;
            $toast = [
                'title' => 'Failed!',
                'message' => 'Failed to update User. Please try again.',
                'type' => 'error',
            ];
            // Redirect back to the edit form with an error toast and input data
            return Redirect::back()->with('toast', $toast)->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            $toast = [
                'title' => 'Success',
                'message' => 'User deleted successfully.',
                'type' => 'success',
            ];
            // Redirect to the index page with a success toast
            return Redirect::route('users.index')->with('toast', $toast);
        } catch (\Exception $th) {
            //throw $th;
            $toast = [
                'title' => 'Failed!',
                'message' => 'Failed to delete User. Please try again.',
                'type' => 'error',
            ];
            // Redirect back to the edit form with an error toast and input data
            return Redirect::back()->with('toast', $toast)->withInput();
        }
    }
}
