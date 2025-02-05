<?php

namespace App\Models;

use App\Actions\Link\LinkeablePublicPolicy;
use Illuminate\Database\Eloquent\Casts\Attribute;

class BiolinkLink extends Link
{
    public $table = 'links';

    protected $eagerLoad = ['rules', 'tags', 'pixels', 'domain'];
    protected $hidden = ['pivot', 'password'];
    protected $appends = [
        'position',
        'animation',
        'leap_until',
        'active_locked',
        'short_url',
        'has_password',
        'model_type',
    ];
    protected $casts = [
        'id' => 'integer',
        'domain_id' => 'integer',
        'user_id' => 'integer',
        'active' => 'boolean',
        'has_password' => 'boolean',
        'position' => 'int',
        'expires_at' => 'datetime',
        'clicked_at' => 'datetime',
        'activates_at' => 'datetime',
        'leap_until' => 'datetime',
    ];

    protected function position(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => $this->pivot->position,
        );
    }

    protected function animation(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => $this->pivot->animation,
        );
    }

    protected function leapUntil(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => $this->pivot->leap_until,
        );
    }

    protected function activeLocked(): Attribute
    {
        return Attribute::make(
            get: function (): bool {
                if (
                    LinkeablePublicPolicy::linkeableExpired($this) ||
                    LinkeablePublicPolicy::linkeableWillActivateLater($this)
                ) {
                    return true;
                }
                return false;
            },
        );
    }

    protected function active(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => !$this->active_locked &&
                (bool) $value,
        );
    }
}
