window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);
    const container = document.querySelector("#container");
    const scrollAmount = container.scrollWidth - window.innerWidth;
    // console.log("scrollAmount =", scrollAmount);
    gsap.to(container, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: "#work-section",
            start: "top top",
            end: "+=" + scrollAmount,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            // markers: true
        }
    });
});