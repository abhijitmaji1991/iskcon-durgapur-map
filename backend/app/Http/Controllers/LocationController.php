<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Location;

class LocationController extends Controller
{
    /**
     * Display a listing of the locations.
     */
    public function index()
    {
        $locations = Location::all()->map(function ($loc) {
            // Convert numeric lat/lng from string database representations to float
            $loc->lat = (float) $loc->lat;
            $loc->lng = (float) $loc->lng;
            if ($loc->active_members !== null) {
                $loc->active_members = (int) $loc->active_members;
            }
            return $loc;
        });

        return response()->json($locations);
    }

    /**
     * Store a newly created location in database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string',
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'address' => 'required|string',
            'description' => 'nullable|string',
            'phone' => 'nullable|string',
            'timings' => 'nullable|string',
            'president' => 'nullable|string',
            'leader' => 'nullable|string',
            'active_members' => 'nullable|integer',
            'occupation' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $location = Location::updateOrCreate(
            ['id' => $validated['id']],
            $validated
        );

        // Cast coordinates to floats for consistent API response
        $location->lat = (float) $location->lat;
        $location->lng = (float) $location->lng;
        if ($location->active_members !== null) {
            $location->active_members = (int) $location->active_members;
        }

        return response()->json($location, 201);
    }

    /**
     * Remove the specified location from database.
     */
    public function destroy($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $location->delete();

        return response()->json(['message' => 'Location deleted successfully']);
    }
}
