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
    public $key;
    public $name;
    public $description;
    public $image;
    public $isStandard;
    public $compatibleBrushHeads;
    public $retailers;
    public $brushPack;

    public function __construct($json) {
        $brush = json_decode($json);

        $this->id = $brush['id'];
        $this->key = $brush['key'];
        $this->name = $brush['name'];
        $this->description = $brush['description'];
        $this->image = $brush['image'];
        $this->isStandard = $brush['isStandard'];
        if ( count($brush['compatibleBrushes'] ) > 0 ) {
            $this->compatibleBrushes = $brush['compatibleBrushes'];
        } else {
            unset($this->compatibleBrushes);
        }
        if ( count($brush['retailers'] ) > 0 ) {
            $this->retailers = $brush['retailers'];
        } else {
            unset($this->retailers);
        }
    }

}
