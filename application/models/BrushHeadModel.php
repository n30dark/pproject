<?php
/**
 * Philips Sonicare Brush Microsite - Born05
 *
 * BrushHead Object
 *
 * This is the class off a brushhead
 *
 * @author    Sergio Paulino <sergio@netants.nl>
 * @link      http://www.born05.nl
 * @copyright Copyright (c) Born05
 * @license   All rights reserved
 */

class BrushHeadModel {

    public $id;
    public $key;
    public $name;
    public $description;
    public $image;
    public $brushPack;

    public function __construct($json) {
        $brushhead = json_decode($json);

        $this->id = $brushhead->id;
        $this->key = $brushhead->key;
        $this->name = $brushhead->name;
        $this->description = $brushhead->description;
        $this->image = $brushhead->image;
        if ( count($brushhead->brushPack ) > 0 ) {
            $this->brushPack = $brushhead->brushPack;
        } else {
            unset($this->brushPack);
        }
    }

}
