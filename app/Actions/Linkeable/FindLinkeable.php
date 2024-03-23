<?php

namespace App\Actions\Linkeable;

use App\Models\Biolink;
use App\Models\Link;
use App\Models\LinkGroup;
use Common\Core\AppUrl;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class FindLinkeable
{
    public function execute(string $hash): Link|LinkGroup|Biolink|null
    {
        if ($link = $this->findLink($hash)) {
            return $link;
        } elseif ($linkGroup = $this->findLinkGroupOrBiolink($hash)) {
            if (!$linkGroup->rotator) {
                return $linkGroup;
            } elseif ($rotatorLink = $linkGroup->randomLink()->first()) {
                return $rotatorLink;
            }
        }

        return null;
    }

    protected function findLink($hash): ?Link
    {
        return Link::with('pixels')
            ->where('hash', $hash)
            ->orWhere(function (Builder $builder) use ($hash) {
                $this->scopeToCurrentDomain($builder);
                $builder->where('alias', $hash);
            })
            ->first();
    }

    protected function findLinkGroupOrBiolink($hash): LinkGroup|Biolink|null
    {
        $linkGroup = null;
        $groupData = DB::table('link_groups')
            ->where(function (Builder $builder) use($hash) {
                $this->scopeToCurrentDomain($builder);
                $builder->where('hash', $hash);
            })
            ->first();

        if ($groupData) {
            $model =
                $groupData->type === 'biolink'
                    ? Biolink::class
                    : LinkGroup::class;
            $model::unguard();
            $linkGroup = new $model((array) $groupData);

            // mark as not dirty
            $linkGroup->syncOriginal();
            $linkGroup->exists = true;
        }

        return $linkGroup;
    }

  protected function scopeToCurrentDomain(Builder $builder): void
  {
    $brandedDomain = app(AppUrl::class)->matchedCustomDomain;
    if ($brandedDomain) {
      $builder->where('domain_id', $brandedDomain->id);
    } else {
      $builder->where(function ($builder) {
        $builder->where('domain_id', 0)->orWhereNull('domain_id');
      });
    }
  }
}
