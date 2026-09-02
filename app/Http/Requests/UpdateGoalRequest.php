<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('goal')) ?? true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['nullable', 'string', 'max:50'],
            'start_date' => ['sometimes', 'required', 'date'],
            'deadline' => ['nullable', 'date', 'after_or_equal:start_date'],
            'icon' => ['nullable', 'string', 'max:50'],
            'target_value' => ['nullable', 'numeric', 'min:0.01', 'max:999999.99'],
            'unit' => ['nullable', 'string', 'max:30'],
            'habit_ids' => ['nullable', 'array'],
            'habit_ids.*' => ['integer', 'exists:habits,id'],
        ];
    }
}
