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

        return $habit instanceof Habit
            && ($this->user()?->can('update', $habit) ?? false);
    }
}
