<?php

namespace App\Policies;

use App\Models\TrackingPixel;

class TrackingPixelPolicy extends WorkspacedResourcePolicy
{
    protected string $resource = TrackingPixel::class;
}
