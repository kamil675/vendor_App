<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;

class Vendor extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'shop_name',
        'address',
        'latitude',
        'longitude',
        'is_online',
        'rating',
        'image'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $casts = [
        'is_online'=>'boolean'
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function requests()
{
    return $this->hasMany(EquipmentRequest::class);
}

public function reviews()
{
    return $this->hasMany(Review::class);
}

public function orders()
{
    return $this->hasMany(Order::class);
}

public function catalogues()
{
    return $this->hasMany(Catalogue::class);
}
}