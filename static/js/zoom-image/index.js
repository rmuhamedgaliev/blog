const zoomDefault = mediumZoom('#zoom-default', { background: '#282828' })
const zoomMargin = mediumZoom('#zoom-margin', { margin: 48 })
const zoomBackground = mediumZoom('#zoom-background', { background: '#282828' })
const zoomScrollOffset = mediumZoom('#zoom-scrollOffset', {
    scrollOffset: 0,
    background: '#282828',
})

// Trigger the zoom when the button is clicked
const zoomToTrigger = mediumZoom('#zoom-trigger')

// Detach the zoom after having been zoomed once
const zoomToDetach = mediumZoom('#zoom-detach')
zoomToDetach.on('closed', () => zoomToDetach.detach())

// Observe zooms to write the history
const observedZooms = [
    zoomDefault,
    zoomMargin,
    zoomBackground,
    zoomScrollOffset,
    zoomToTrigger,
    zoomToDetach,
]

observedZooms.forEach(zoom => {
    zoom.on('open', event => {
        const time = new Date().toLocaleTimeString()
        history.innerHTML += `<li>Image "<em>${event.target.alt
            }</em>" was zoomed at ${time}</li>`
    })

    zoom.on('detach', event => {
        const time = new Date().toLocaleTimeString()
        history.innerHTML += `<li>Image <em>"${event.target.alt
            }"</em> was detached at ${time}</li>`
    })
})