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

class BrushModel {

    public $id;
    public $name;
    public $image;
    public $preferred;
    public $compatibleBrushHeads;

    public function __construct($json) {
        $brush = json_decode($json);

        $this->id = $brush->id;
        $this->name = $brush->name;
        $this->image = $brush->image;
        $this->preferred = false;

        if ( count($brush->compatibleBrushHeads ) > 0 ) {
            $this->compatibleBrushHeads = $brush->compatibleBrushHeads;
        } else {
            unset($this->compatibleBrushHeads);
        }
    }

}
