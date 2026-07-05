<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->string('id')->primary(); // string ID to match frontend mock keys
            $table->string('name');
            $table->string('category');
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);
            $table->string('address');
            $table->text('description')->nullable();
            $table->string('phone')->nullable();
            $table->string('timings')->nullable();
            $table->string('president')->nullable();
            $table->string('leader')->nullable();
            $table->integer('active_members')->nullable();
            $table->string('occupation')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
