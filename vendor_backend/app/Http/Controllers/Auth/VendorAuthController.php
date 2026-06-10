<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class VendorAuthController extends Controller
{
public function register(Request $request)
{
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:vendors,email',
        'phone' => 'required',
        'password' => 'required|min:6',
        'shop_name' => 'required',
        'address' => 'required'
    ]);

    $vendor = Vendor::create([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        'password' => Hash::make($request->password),
        'shop_name' => $request->shop_name,
        'address' => $request->address
    ]);

    return response()->json([
        'message' => 'Vendor Registered',
        'data' => $vendor
    ]);
}

    public function login(Request $request)
{
    $credentials = $request->only(
        'email',
        'password'
    );

    if(!$token = auth('api')->attempt($credentials))
    {
        return response()->json([
            'error'=>'Invalid Credentials'
        ],401);
    }

    return response()->json([
        'token'=>$token
    ]);
}

public function profile()
{
    $vendor = auth('api')->user();

    return response()->json([
        'id' => $vendor->id,
        'name' => $vendor->name,
        'email' => $vendor->email,
        'phone' => $vendor->phone,
        'shop_name' => $vendor->shop_name,
        'address' => $vendor->address,
        'latitude' => $vendor->latitude,
        'longitude' => $vendor->longitude,
        'is_online' => $vendor->is_online,
        'rating' => $vendor->rating,
        'created_at' => $vendor->created_at,
        'updated_at' => $vendor->updated_at,

        'image' => $vendor->image,

        'image_url' => $vendor->image
            ? asset('storage/' . $vendor->image)
            : null,
    ]);
}

public function logout()
{
    auth('api')->logout();

    return response()->json([
        'message'=>'Logout Successful'
    ]);
}
}