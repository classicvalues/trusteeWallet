import React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = props => (
    <Svg width={27} height={24} fill="none" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.417 20.239a6.907 6.907 0 01-.624.523c-.429.33-.89.61-1.363.859-.95.485-1.963.84-3.009 1.051-.258.06-.523.098-.784.145l-.396.052-.198.025-.2.02-.397.037-.4.021c-.265.021-.533.02-.8.027-.783.006-1.566-.03-2.346-.107.09-.129.18-.258.267-.39.251-.388.476-.796.673-1.211.39-.836.672-1.696.914-2.554.233-.845.504-1.668.82-2.487.319-.822.683-1.625 1.092-2.406-.292.336-.555.697-.803 1.068-.25.37-.483.753-.7 1.144a17.765 17.765 0 00-1.116 2.447c-.311.82-.633 1.628-1.032 2.375-.392.752-.88 1.435-1.436 2.095L0 23.66l.9.128c1.11.159 2.237.242 3.368.2.281-.015.564-.019.846-.05l.423-.04.421-.057c.282-.031.56-.095.838-.145.277-.067.556-.12.827-.204.275-.073.544-.167.813-.256.266-.102.531-.204.79-.323a9.714 9.714 0 001.482-.832c.468-.317.9-.682 1.292-1.09.383-.408.736-.852.979-1.352a5.324 5.324 0 01-.562.599zm6.208-14.937a1.656 1.656 0 011.175-.485 1.659 1.659 0 01.324 3.289 1.664 1.664 0 01-1.706-.707 1.655 1.655 0 01-.279-.922c0-.444.173-.86.486-1.175zM19.8 9.153a2.669 2.669 0 002.676-2.676c0-.71-.281-1.39-.783-1.893a2.679 2.679 0 00-4.57 1.893c0 .715.279 1.388.785 1.893a2.668 2.668 0 001.892.783zm.783 3.834c-3.83 3.368-5.428 3.69-7.012 2.953l1.73-2.186c.255-.32.44-.699.536-1.097l.698-2.914-2.915.698a2.82 2.82 0 00-1.095.534l-2.187 1.731c-.739-1.584-.415-3.182 2.953-7.011 3.18-3.617 9.915-4.449 11.91-4.619-.17 1.996-1.001 8.73-4.619 11.911zm-2.55 5.22a.632.632 0 01-.263.397c-.404.277-1.024.662-1.576.997l.027-.104c.268-1.053.265-1.865-.006-2.417.725-.22 1.509-.626 2.398-1.233-.216.816-.465 1.789-.58 2.36zm-6.057-1.889a1.136 1.136 0 01-.95.43l-.014-.001-.87.001 3.018-3.63-3.632 3.017.003-.856-.001-.027a1.141 1.141 0 01.43-.951l3.197-2.53c.204-.163.446-.282.7-.343l1.305-.312-.313 1.305c-.061.253-.18.495-.343.701l-2.53 3.195v.001zm-5.194-6.262l-.104.028c.333-.552.718-1.173.996-1.577a.63.63 0 01.396-.263c.571-.115 1.544-.363 2.36-.579-.607.889-1.012 1.672-1.232 2.398-.552-.272-1.364-.275-2.417-.007zM25.728.022c-.373.015-9.171.42-13.201 5.002-.382.433-.754.875-1.116 1.325-.583.16-2.635.717-3.541.9-.423.085-.79.327-1.034.683-.618.899-1.695 2.745-1.74 2.822l-.782 1.34 1.423-.618c.931-.405 2.496-.821 3.054-.479.092.056.187.15.203.412h.003c.01.66.191 1.293.525 1.942l-.193.153a2.158 2.158 0 00-.815 1.785l-.005 2.478 2.478-.005a2.154 2.154 0 001.786-.814l.153-.194c.649.334 1.282.514 1.942.525v.004c.262.016.355.111.412.203.343.558-.074 2.122-.48 3.054l-.62 1.425 1.342-.783c.079-.046 1.924-1.123 2.823-1.74.355-.245.598-.612.684-1.035.182-.906.74-2.957.9-3.541.418-.335.858-.706 1.323-1.117C25.834 9.72 26.24.922 26.255.55l.023-.55-.55.022z"
            fill="#10D078"
        />
    </Svg>
)

export default SvgComponent
