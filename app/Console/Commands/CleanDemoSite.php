<?php

namespace App\Console\Commands;

use App\User;
use Common\Auth\Permissions\Permission;
use Common\Auth\Permissions\Traits\SyncsPermissions;
use Common\Localizations\Localization;
use Hash;
use Illuminate\Console\Command;

class CleanDemoSite extends Command
{
    use SyncsPermissions;

    protected $signature = 'demo:clean';

    public function handle(): void
    {
        // reset admin user
        $this->cleanAdminUser('admin@admin.com');

        // delete localizations
        app(Localization::class)
            ->get()
            ->each(function (Localization $localization) {
                if (strtolower($localization->name) !== 'english') {
                    $localization->delete();
                }
            });
    }

    private function cleanAdminUser($email): void
    {
        $admin = User::where('email', $email)->first();

        if (!$admin) {
            $admin = User::create([
                'email' => $email,
            ]);
        }

        $admin->avatar = null;
        $admin->username = 'admin';
        $admin->first_name = 'Demo';
        $admin->last_name = 'Admin';
        $admin->password = Hash::make('admin');
        $admin->save();

        $adminPermission = app(Permission::class)
            ->where('name', 'admin')
            ->first();
        $this->syncPermissions($admin, [$adminPermission]);
    }
}
