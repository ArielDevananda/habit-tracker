<?php

namespace App\Http\Requests;

use App\Models\Habit;

class UpdateHabitRequest extends StoreHabitRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $habit = $this->route('habit');

        if (! $habit instanceof Habit) {
            $habit = Habit::find($habit);
        }

        return $habit && ($this->user()?->can('update', $habit) ?? false);
    }
}
