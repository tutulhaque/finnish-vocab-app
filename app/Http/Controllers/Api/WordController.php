<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Word::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'finnish' => 'required|string',
            'english' => 'required|string',
            'example' => 'required|string',
        ]);

        // Check if the word already exists
        $existing = Word::where('finnish', $validated['finnish'])
            ->where('english', $validated['english'])
            ->where('example', $validated['example'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Word already Added to favorite',
                'word' => $existing
            ], 200);
        }

        $wordData = Word::create($validated);
        return response()->json($wordData, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Word::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $wordData = Word::findOrFail($id);
        $validated = $request->validate([
            'finnish' => 'required|string',
            'english' => 'required|string',
            'example' => 'required|string',
        ]);

        $wordData->update($validated);
        return response()->json($wordData);
    }
    public function destroy(string $id)
    {
        $wordData = Word::findOrFail($id);
        $wordData->delete();
        return response()->json(null, 204);
    }

    // 
    public function apiWords(Request $request)
    {
        $limit = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $all = $request->query('all', 'false');

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'x-api-key' => config('services.finnfast.api_key'),
        ])->get('https://finnfast.fi/api/words', [
            'limit' => $limit,
            'page' => $page,
            'all' => filter_var($all, FILTER_VALIDATE_BOOLEAN),
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }
        \Log::error('Finnfast API Failed', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return response()->json(['error' => 'Unable to fetch words from FinnFast API'], 500);
    }
}
