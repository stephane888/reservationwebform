<?php

/**
 *
 * @author stephane
 *
 */
class translateWebform {
	public  $prefix='reservation_';
	/**
	 *
	 * @var array
	 */
	protected $field_type=[
			'markup'=>'markup',
			//'hidden'=>'hidden',
			'textfield'=>'textfield',
			'email'=>'email',
			'webform_email'=>'webform_email',
			'date'=>'date',
			'file'=>'file',
			//'grid'=>'grid',
			//'fieldset'=>'fieldset',
			'time'=>'time',
			'select'=>'select',
			'number'=>'number',
			//'pagebreak'=>'pagebreak',
			'textarea'=>'textarea',
			'html_textarea'=>'html_textarea',
			'radios'=>'radios',
	];
	/**
	 *
	 * @param array $form
	 * @return array
	 */
	public function translateLabel($form){
		$form['submitted']=$this->loop_fields($form['submitted']);
		return $form;
	}

	/**
	 *
	 * @param array $form
	 * @return array
	 */
	public function translateWebformSettings($form){
		if(isset($form['#node']->webform)){
			$form['#node']->webform = $this->loop_settings_webform( $form['#node']->webform );
		}
		return $form;
	}

	/**
	 *
	 * @param array $webform
	 * @return mixed
	 */
	protected function loop_settings_webform( $webform ){
		/**
		 *
		 */
		if( $webform['confirmation'] ){
			$webform['confirmation'] = $this->tranlateString( $webform['confirmation'] );
		}

		/**
		 *
		 */
		foreach ($webform['emails'] as $key_email=>$email) {
			if($email['status']){
				$webform['emails'][$key_email]['subject'] = $this->tranlateString($email['subject']);
			}
		}

		/**
		 *
		 */
		return $webform;
	}

	/**
	 *
	 * @param array $fields
	 * @return mixed
	 */
	protected function loop_fields($fields){
		//dpm($fields);
		foreach ($fields as $key=>$var) {
			if(is_array($var) && isset($var['#type'])){
				if($var['#type']=='fieldset'){
					/**
					 *
					 */
					$fields[$key]['#title'] = $this->tranlateString($fields[$key]['#title']);
					foreach ($var as $sub_key=>$fieldset){
						if(is_array($fieldset) && isset($fieldset['#type'])){
							//dpm([$fieldset['#title'],$fieldset['#type']]);

							if(in_array($fieldset['#type'], $this->field_type)){
								/**
								 * #title
								 */
								$fields[$key][$sub_key]['#title'] = $this->tranlateString($fields[$key][$sub_key]['#title']);
								/**
								 * PlacerHolder
								 */
								if(!empty($fields[$key][$sub_key]['#webform_placeholder'])){
									//dpm($fields[$key][$sub_key]);
									$placeholder = $this->tranlateString($fields[$key][$sub_key]['#webform_placeholder']);
									$fields[$key][$sub_key]['#webform_placeholder'] = $placeholder;
									$fields[$key][$sub_key]['#attributes']['placeholder'] = $placeholder;
								}
								/**
								 * Options for select and radios
								 */
								if($fieldset['#type']=='radios' || $fieldset['#type']=='select'){
									if(!empty($fields[$key][$sub_key]['#default_value'])){
										$fields[$key][$sub_key]['#default_value'] = $this->tranlateString($fields[$key][$sub_key]['#default_value']);
									}
									foreach ($fieldset['#options'] as $key_option=>$value){
										$fields[$key][$sub_key]['#options'][$key_option] = $this->tranlateString($value);
									}
								}
							}
						}
					}
				}
				elseif(in_array($var['#type'], $this->field_type)){
					/**
					 * #title
					 */
					$fields[$key]['#title'] = $this->tranlateString($fields[$key]['#title']);

					/**
					 * PlacerHolder
					 */
					if(!empty($fields[$key]['#webform_placeholder'])){
						$fields[$key]['#webform_placeholder'] = $this->tranlateString($fields[$key]['#webform_placeholder']);
					}

					/**
					 * Options for select and radios
					 */
					if($var['#type']=='radios' || $var['#type']=='select'){
						if(!empty($fields[$key]['#default_value'])){
							$fields[$key]['#default_value'] = $this->tranlateString($fields[$key]['#default_value']);
						}
						foreach ($var['#options'] as $key_option=>$value){
							$fields[$key]['#options'][$key_option] = $this->tranlateString($value);
						}
					}
				}
			}
		}
		return $fields;
	}

	/**
	 *
	 * @param string $string
	 * @return mixed
	 */
	protected function tranlateString($string){
		$options=[
				'context'=>'custom o-de-mer'
		];
		$string = t($this->prefix . $string, [], []);
		return str_replace( $this->prefix, "", $string);
	}
}