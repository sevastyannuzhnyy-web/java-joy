import React from "react";

export default function MainApp() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "48px", marginBottom: "8px" }}>Java Joy</h1>
        <p style={{ opacity: .8 }}>Home page is working</p>
        <p style={{ marginTop: "16px" }}>
          <a
            href="#/admin"
            style={{ padding: "6px 12px", border: "1px solid #000", borderRadius: 9999 }}
          >
            Go to Admin
          </a>
        </p>
      </div>
    </main>
  );
}
