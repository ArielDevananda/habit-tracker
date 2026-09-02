<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoutineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('routine')) ?? true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'in:active,paused,archived'],
            'habit_ids' => ['nullable', 'array'],
            'habit_ids.*' => ['integer', 'exists:habits,id'],
        ];
    }
}
