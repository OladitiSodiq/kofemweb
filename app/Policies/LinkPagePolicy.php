<?php

namespace App\Policies;

use App\Models\LinkPage;

class LinkPagePolicy extends WorkspacedResourcePolicy
{
    protected string $resource = LinkPage::class;
    protected string $permissionName = 'custom_pages';
}
