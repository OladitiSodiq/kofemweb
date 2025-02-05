<?php

namespace App\Policies;

use App\Models\LinkDomain;

class LinkDomainPolicy extends WorkspacedResourcePolicy
{
    protected string $resource = LinkDomain::class;

    protected string $permissionName = 'custom_domains';
}
