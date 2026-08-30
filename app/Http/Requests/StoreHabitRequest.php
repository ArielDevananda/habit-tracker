<?php

namespace App\Http\Requests;

use App\Models\Habit;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHabitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Habit::class) ?? false;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->frequency === 'daily') {
            $this->merge([
                'days_of_week' => null,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['nullable', 'string', Rule::in(['Health', 'Mind', 'Productivity', 'Finance', 'Fitness', 'Social', 'General'])],

            'target_value' => [
                'nullable',
                'required_with:unit',
                'numeric',
                'min:0.01',
                'max:999999.99',
            ],
            'unit' => [
                'nullable',
                'required_with:target_value',
                'string',
                'max:30',
            ],

            'frequency' => [
                'required',
                'string',
                Rule::in(['daily', 'weekly']),
            ],
            'days_of_week' => [
                Rule::requiredIf(
                    fn (): bool => $this->string('frequency')->toString() === 'weekly',
                ),
                'nullable',
                'array',
                'min:1',
                'max:7',
            ],
            'days_of_week.*' => [
                'integer',
                'between:0,6',
                'distinct',
            ],

            'is_active' => ['sometimes', 'boolean'],
            'start_date' => ['required', 'date'],
        ];
    }
}
