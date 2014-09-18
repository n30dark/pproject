<?php
/**
 * Philips Sonicare Brush Microsite - Born05
 *
 * Brush Object
 *
 * This is the class off a brush
 *
 * @author    Sergio Paulino <sergio@netants.nl>
 * @link      http://www.born05.nl
 * @copyright Copyright (c) Born05
 * @license   All rights reserved
 */

namespace application\models;

class BrushModel {

    public $id;
    public $name;
    public $image;
    public $compatibleBrushHeads;

    public function __construct($json) {
        $brush = json_decode($json);

        $this->id = $brush['id'];
        $this->name = $brush['name'];
        $this->image = $brush['image'];
        if ( count($brush['compatibleBrushes'] ) > 0 ) {
            $this->compatibleBrushes = $brush['compatibleBrushes'];
        } else {
            unset($this->compatibleBrushes);
        }
    }

}
