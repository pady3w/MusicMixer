import React from "react";
import CS_CapstoneGroup from "../../Images/cropped-group.png";

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px'
    },
    section: {
      marginBottom: '64px',
      textAlign: 'center'
    },
    heading: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      textAlign: 'center'
    },
    paragraph: {
      fontSize: '1.125rem',
      maxWidth: '36rem',
      margin: '0 auto',
      textAlign: 'center'
    },
    bulletContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '32px'
    },
    bulletItem: {
      fontSize: '1.125rem',
      marginBottom: '12px',
      textAlign: 'center'
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center'
    },
    image: {
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }
  };

  function About() {
  return (
    <div style={styles.container} id="faq">
      <section style={styles.section}>
        <h2 style={styles.heading}>FAQ</h2>
        <p style={styles.paragraph}>
        Q: What is MusicMagic?    <br />   <br />
        A: MusicMagic is an AI-powered platform that helps users generate custom music and lyrics from text prompts. 
        Whether you're a musician, writer, or just curious, our tools let you experiment with musical creativity in a whole new way.
        <br />   <br />    <br />
        Q: Do I need any musical background to use MusicMagic?  <br />   <br />
        A: Not at all! MusicMagic is built for everyone — from complete beginners to experienced musicians. Just type in a 
        prompt, and let the AI do the heavy lifting.
        <br />   <br />    <br />
        Q: What kind of prompts should I use?  <br />   <br />
        A: Be as creative or specific as you'd like! Try prompts like “a peaceful piano melody at sunset” or “punk rock 
        anthem about resilience.” The more vivid your input, the more expressive the result.
        <br />   <br />    <br />
        Q: Can I combine different genres or styles?  <br />   <br />
        A: Yes! You can blend genres in your prompt, such as “jazz fused with lo-fi beats” or “classical orchestra meets 
        synthwave.” The AI will interpret and generate music or lyrics that reflect that mix.
        </p>
      </section>

      <section style={styles.section} id="music-gen">
        <h2 style={styles.heading}>Music Generation</h2>
        <p style={styles.paragraph}>
        Generating acoustic music has never been easier! Start your journey on the Music Mixer Music Generation page, 
        where you can input a prompt to create an entirely new piece of music.
        Our customized model has been trained on thousands of data points to help your music truly soar. Experiment with 
        different styles, combine genres to create unique works, or stick with familiar favorites.
        The world of music is at your fingertips.
        </p>
      </section>

      <section style={styles.section} id="lyric-gen">
        <h2 style={styles.heading}>Lyric Generation</h2>
        <p style={styles.paragraph}>
        Lyrics speak to the soul. Like the pages of a magical book, they take us on adventures through new and familiar worlds.
        Head over to the Music Mixer Lyric Generation page and craft your own custom prompt. Our tool gives everyone the power 
        to explore any world they imagine. Powered by OpenAI, we help guide your prompts to generate lyrics that resonate and transcend time.
        </p>
      </section>

      <section style={styles.section} id="about-us">
        <h2 style={styles.heading}>About Us</h2>
        <p style={styles.paragraph}>
        We are a group of college students from the University of Missouri, passionate about reimagining how people 
        experience music. Music is a universal medium that transcends age, language, and culture. Our generation tools 
        make music creation accessible to anyone with a desire to create.
        </p>
      </section>

      <section style={styles.section} id="our-team">
        <h2 style={styles.heading}>Music Mixer Team</h2>
        
        <div style={styles.bulletContainer}>
          <div style={styles.bulletItem}> Alex Savas</div>
          <div style={styles.bulletItem}> Olo Masiza</div>
          <div style={styles.bulletItem}> Michael Hackmann</div>
          <div style={styles.bulletItem}> Parker Dierkens</div>
          <div style={styles.bulletItem}> Blake Simpson</div>
        </div>
        
        <div style={styles.imageContainer}>
          <img
              src={CS_CapstoneGroup}
              alt="CS Capstone Group"
              width="1000" 
              height="562"
          />
        </div>
      </section>
    </div>
  );
};
export default About;