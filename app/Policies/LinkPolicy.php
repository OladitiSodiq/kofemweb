<?php

namespace App\Policies;

use App\Models\Link;

class LinkPolicy extends WorkspacedResourcePolicy
{
    protected string $resource = Link::class;
}
