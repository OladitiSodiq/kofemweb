<?php

namespace App\Policies;

use App\Models\LinkOverlay;

class LinkOverlayPolicy extends WorkspacedResourcePolicy
{
    protected string $resource = LinkOverlay::class;
}
