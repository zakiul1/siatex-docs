<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleAndPermissions
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param string|null $role
     * @param string|null $permission
     * @param string|null $category
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ?string $role = null, ?string $permission = null): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }

        if ($user->isSAdmin()) {
            return $next($request);
        }

        // Check role if specified
        if ($role && !$this->hasRole($user, $role)) {
            abort(403, "You don't have the required role to access this page.");
        }

        // Check permission if specified
        if ($permission && !$this->hasPermission($user, $permission)) {
            abort(403, "You don't have the required permission to access this page.");
        }

        return $next($request);
    }

    /**
     * Check if the user has the specified role.
     *
     * @param \App\Models\User $user
     * @param string $role
     * @return bool
     */
    protected function hasRole($user, string $role): bool
    {
        if ($role === 'Admin' && $user->isAdmin()) {
            return true;
        }

        if ($role === 'Super Admin' && $user->isSAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Check if the user has the specified permission.
     *
     * @param \App\Models\User $user
     * @param string $permission
     * @param string|null $category
     * @return bool
     */
    protected function hasPermission($user, string $permission, ?string $category = 'primary'): bool
    {

        return isset($user->permissions[$permission]) && $user->permissions[$permission];
    }
}
