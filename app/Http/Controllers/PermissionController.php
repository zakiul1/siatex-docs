<?php

// app/Http/Controllers/PermissionController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PermissionController extends Controller
{
    public function edit(User $user)
    {
        $modules = config('module');
        $permissions = $user->permissions ?? [];

        return inertia('Users/PermissionManager', [
            'user' => $user,
            'modules' => $modules,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'permissions' => 'array',
        ]);

        $user->update(['permissions' => $validated['permissions']]);
        // Prepare the toast notification message
        $toastData = [
            'title' => 'Permission Updated',
            'message' => 'User permission has been Updated for ' . $user->name,
            'type' => 'success',
        ];
        return redirect()
            ->route('users.index')
            ->with('toast', $toastData);
    }
}
