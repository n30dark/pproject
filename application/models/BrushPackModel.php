<?php
/**
 * Philips Sonicare Brush Microsite - Born05
 *
 * BrushPack Object
 *
 * This is the class off a brush
 *
 * @author    Sergio Paulino <sergio@netants.nl>
 * @link      http://www.born05.nl
 * @copyright Copyright (c) Born05
 * @license   All rights reserved
 */

namespace application\models;

class BrushPackModel {

    public $id;
    public $brush;
    public $numBrushes;
    public $price;
    public $retailers;

    public function __construct($json) {
        $pack = json_decode($json);

        $this->id = $pack['id'];
        $this->brush = $pack['brush'];
        $this->numBrushes = $pack['numBrushes'];
        $this->price = $pack['price'];
    }

}
